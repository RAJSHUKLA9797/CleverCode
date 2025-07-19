// UserProfileColor.js
import React from "react";

export function UserProfileColor(rank) {
  switch (rank.toLowerCase()) {
    case "newbie":
      return "text-gray-700"; // Gray for "newbie"
    case "pupil":
      return "text-green-700"; // Green for "pupil"
    case "specialist":
      return "text-cyan-700"; // Cyan for "specialist"
    case "expert":
      return "text-blue-700"; // Blue for "expert"
    case "candidate master":
      return "text-purple-700"; // Violet for "candidate master"
    case "master":
    case "international master":
      return "text-orange-700"; // Orange for "master" and "international master"
    case "grandmaster":
    case "international grandmaster":
    case "legendary grandmaster":
      return "text-red-700"; // Red for "grandmaster", "international grandmaster", and "legendary grandmaster"
    default:
      return "text-gray-600"; // Default color if rank doesn't match
  }
}
