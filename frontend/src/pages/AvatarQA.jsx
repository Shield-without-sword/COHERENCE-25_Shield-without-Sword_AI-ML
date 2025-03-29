// src/pages/AvatarQA.jsx
import React from "react";
import AvatarQA from "../components/AvatarQA";

const AvatarQAPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Interactive Learning Assistant</h1>
      <p className="text-center mb-8 max-w-lg mx-auto">
        Practice your skills by answering questions from our virtual assistant. 
        Your answers will be recorded for later review.
      </p>
      <AvatarQA />
    </div>
  );
};

export default AvatarQAPage;