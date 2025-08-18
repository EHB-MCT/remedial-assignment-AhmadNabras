// backend/server/routes/colony-routes.js
import express from "express";
import Colony from "../models/Colony.js";

const router = express.Router();

// ✅ Create colony
router.post("/", async (req, res) => {
  try {
    const { name, water, oxygen, energy, production } = req.body;

    if (!name || !production) {
      return res
        .status(400)
        .json({ error: "Name and production type are required" });
    }

    if (water > 50 || oxygen > 50 || energy > 50) {
      return res
        .status(400)
        .json({ error: "You can only choose max seeds of 50" });
    }

    const count = await Colony.countDocuments();
    if (count >= 5) {
      return res.status(400).json({ error: "Maximum of 5 colonies allowed" });
    }

    const colony = new Colony({
      name,
      water: water || 0,
      oxygen: oxygen || 0,
      energy: energy || 0,
      production,
      productionAmount: 0,
      history: [],
      transfers: [],
    });

    await colony.save();
    res.status(201).json(colony);
  } catch (err) {
    console.error("Error creating colony:", err);
    res.status(500).json({ error: "Server error creating colony" });
  }
});

// Get all colonies
router.get("/", async (req, res) => {
  try {
    const colonies = await Colony.find();
    res.json(colonies);
  } catch (err) {
    console.error("Error fetching colonies:", err);
    res.status(500).json({ error: "Server error fetching colonies" });
  }
});

// Delete colony
router.delete("/:id", async (req, res) => {
  try {
    const colony = await Colony.findById(req.params.id);
    if (!colony) return res.status(404).json({ error: "Colony not found" });

    if (colony.dead) {
      return res.status(400).json({
        error: "Dead colonies cannot be deleted individually. Use restart.",
      });
    }

    await Colony.findByIdAndDelete(req.params.id);
    res.json({ message: "Colony deleted successfully" });
  } catch (err) {
    console.error("Error deleting colony:", err);
    res.status(500).json({ error: "Server error deleting colony" });
  }
});

// Delete ALL colonies (restart game)
router.delete("/", async (req, res) => {
  try {
    await Colony.deleteMany({});
    res.json({ message: "All colonies deleted successfully" });
  } catch (err) {
    console.error("Error deleting colonies:", err);
    res.status(500).json({ error: "Server error deleting all colonies" });
  }
});

// ✅ Transfer resources
router.post("/transfer", async (req, res) => {
  try {
    const { fromColonyId, toColonyId, resource, amount } = req.body;

    if (!fromColonyId || !toColonyId || !resource || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fromColony = await Colony.findById(fromColonyId);
    const toColony = await Colony.findById(toColonyId);

    if (!fromColony || !toColony) {
      return res.status(404).json({ error: "Colony not found" });
    }

    if (fromColony.dead || toColony.dead) {
      return res.status(400).json({
        error: "Dead colonies cannot transfer or receive resources",
      });
    }

    if (fromColony.productionAmount < amount) {
      return res
        .status(400)
        .json({ error: "Not enough resources in production storage" });
    }

    if (toColony[resource] + amount > 50) {
      return res
        .status(400)
        .json({ error: "Target colony resource cannot exceed 50" });
    }

    // ✅ Deduct from production AND main resource of sender
    fromColony.productionAmount -= amount;
    fromColony[resource] = Math.max(0, fromColony[resource] - amount);

    // ✅ Add to main resource of receiver
    toColony[resource] += amount;

    // ✅ Log transfer
    fromColony.transfers.push({
      toColonyId,
      toColonyName: toColony.name,
      resource,
      amount,
      timestamp: new Date(),
    });

    await fromColony.save();
    await toColony.save();

    res.json({ message: "Transfer successful", fromColony, toColony });
  } catch (err) {
    console.error("Error transferring resources:", err);
    res.status(500).json({ error: "Server error transferring resources" });
  }
});

// Colony report
router.get("/reports/all", async (req, res) => {
  try {
    const colonies = await Colony.find();

    const reports = colonies.map((colony) => {
      const startTime = colony.createdAt;
      const deathTime = colony.dead ? colony.deadSince : null;
      const survivalMinutes = deathTime
        ? Math.round((deathTime - startTime) / 60000)
        : Math.round((Date.now() - startTime) / 60000);

      return {
        name: colony.name,
        emoji: colony.dead ? "☠" : "🚀",
        startTime,
        deathTime,
        survivalMinutes,
        waterUsed: colony.totalWaterUsed,
        oxygenUsed: colony.totalOxygenUsed,
        energyUsed: colony.totalEnergyUsed,
        totalProduction: colony.totalProduced,
        transfers: colony.transfers || [],
      };
    });

    res.json(reports);
  } catch (err) {
    console.error("Error generating reports:", err);
    res.status(500).json({ error: "Server error generating reports" });
  }
});

// Colony history
router.get("/:id/history", async (req, res) => {
  try {
    const colony = await Colony.findById(req.params.id);
    if (!colony) return res.status(404).json({ error: "Colony not found" });

    res.json(colony.history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Server error fetching history" });
  }
});

export default router;
