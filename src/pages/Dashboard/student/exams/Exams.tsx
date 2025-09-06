import { ExamList } from "@/components/exams/ExamList";

export default function Exams() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Exams</h1>
      <ExamList />
    </div>
  );
}
