import express from "express";
export const router = express.Router();

export interface Index {
	status: "Ready" | "Error"
}

// Home page route.
router.get("/", function (req, res) {
	const index: Index = {
		status: "Ready"
	};
	res.json(index);
})
