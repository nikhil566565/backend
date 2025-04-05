const express = require("express");
const router = express.Router();
const Food = require("../models/foodModel");

// Get all food items
router.get("/foods", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food items", error })
    }
});

router.get("/foods/:id", async (req, res) => {
    try {
        const food = await Food.findOne({ id: req.params.id });
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.json(food);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food item", error });
    }
});
// Add a new food item
router.post("/foods", async (req, res) => {
    try {
        const { id, name, price, category, image, description, rating } = req.body;

        if (!id || !name || !price || !category || !image || !description || !rating) {
            return res.status(400).json({ message: "Id, Name, Price, Image, Description, Rating, and Category are required!" });
        }

        const newFood = new Food({ id, name, price, category, image, description, rating });
        await newFood.save();
        res.status(201).json({ message: "Food item added successfully!", food: newFood });
    } catch (error) {
        res.status(500).json({ message: "Error adding food item", error });
    }
});

//Delete a food item by ID
router.delete("/foods/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFood = await Food.findOneAndDelete({ id });
        if (!deletedFood) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.json({ message: "Food item deleted successfully", deletedFood });
    } catch (error) {
        res.status(500).json({ message: "Error deleting food item", error });
    }
});

router.put("/foods/:id", async (req, res) => {
    try {
        const { id } = req.params; // This will be your custom id like 17
        const updateFields = req.body;

        console.log("ID to update:", id);
        console.log("Data to update:", updateFields);

        Object.keys(updateFields).forEach(key => {
            if (updateFields[key] === '' || updateFields[key] === undefined) {
                delete updateFields[key];
            }
        });

        const updatedFood = await Food.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedFood) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.json({ message: "✅ Food item updated successfully", updatedFood });
    } catch (error) {
        res.status(500).json({ message: "❌ Error updating food item", error });
    }
});
module.exports = router;
