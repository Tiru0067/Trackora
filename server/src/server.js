import app from "#/app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development")
    console.log(`Server running at http://localhost:${PORT}`);
});
