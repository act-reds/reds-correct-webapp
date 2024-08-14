// // src/components/CreateCourse.tsx
// import React, { useState } from "react";

// const CreateCourse: React.FC = () => {
//   const [name, setName] = useState("");

//   async function handleSubmit(event: React.FormEvent) {
//     event.preventDefault();

//     const response = await fetch("/api/courses", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name }),
//     });

//     const result = await response.json();
//     console.log(result);
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Course Name"
//         required
//       />
//       <button type="submit">Create Course</button>
//     </form>
//   );
// };

// export default CreateCourse;
