import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PostForm() {
  const [drink, setDrink] = useState([]); // 配列で管理
  const [imageFile, setImageFile] = useState(null);
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const drinkOptions = [
    "コーラ",
    "オレンジジュース",
    "ウーロン茶",
    "カルピス",
    "カルピスソーダ",
    "ファンタメロン",
    "ファンタオレンジ",
    "ファンタグレープ",
    "ジンジャーエール",

    // 必要に応じて追加
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = "";
    if (imageFile) {
      const storageRef = ref(storage, `images/${imageFile.name}_${Date.now()}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
      setPreviewUrl(imageUrl);
    }

    await addDoc(collection(db, "posts"), {
      text: drink, // 配列で保存
      imageUrl: imageUrl,
      comment: comment,
      createdAt: serverTimestamp(),
    });

    setDrink([]);
    setImageFile(null);
    setComment("");
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {drinkOptions.map((option) => (
          <label key={option} style={{ display: "block" }}>
            <input
              type="checkbox"
              value={option}
              checked={drink.includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  if (drink.length < 4) {
                    setDrink([...drink, option]);
                  }
                } else {
                  setDrink(drink.filter((d) => d !== option));
                }
              }}
              disabled={!drink.includes(option) && drink.length >= 4}
            />
            {option}
          </label>
        ))}
      </div>
      <div style={{ fontSize: "12px", color: "gray" }}>
        ※2〜4種類まで選択できます
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="感想"
      />
      <button
        type="submit"
        disabled={uploading || drink.length < 2 || drink.length > 4}
      >
        {uploading ? "アップロード中..." : "投稿"}
      </button>
      {previewUrl && (
        <div>
          <p>アップロード画像:</p>
          <img
            src={previewUrl}
            alt="アップロード画像"
            style={{ maxWidth: "200px" }}
          />
        </div>
      )}
    </form>
  );
}
