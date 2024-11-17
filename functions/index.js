const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

exports.helloFirestore = onDocumentCreated("example/{docId}", (event) => {
  const newValue = event.data;
  console.log("New document added:", newValue);
});
