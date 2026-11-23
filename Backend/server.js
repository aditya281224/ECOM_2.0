import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const port = process.env.PORT || 5000;

try {
	await connectDB();
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
} catch (error) {
	console.error(`Server startup failed: ${error.message}`);
	process.exitCode = 1;
}