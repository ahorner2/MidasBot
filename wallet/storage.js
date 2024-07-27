class TonConnectStorage {
  constructor(chatId) {
    this.chatId = chatId;
    this.storage = new Map();
  }

  getKey(key) {
    return this.chatId.toString() + key;
  }

  async removeItem(key) {
    this.storage.delete(this.getKey(key));
  }

  async setItem(key, value) {
    this.storage.set(this.getKey(key), value);
  }

  async getItem(key) {
    return this.storage.get(this.getKey(key)) || null;
  }
}

// Assuming the IStorage interface is something you need to implement manually in JS, here is a simple placeholder:
const IStorage = {
  removeItem: function () {},
  setItem: function () {},
  getItem: function () {},
};

// // Example usage
// const storage = new TonConnectStorage("12345");
// storage.setItem("exampleKey", "exampleValue").then(() => {
//   storage.getItem("exampleKey").then((value) => {
//     console.log(value); // Output: 'exampleValue'
//   });
// });
