import app from "./app";

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on http://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`);
});