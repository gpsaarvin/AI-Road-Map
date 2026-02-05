export default function CourseSlugPage({ params }: { params: { slug: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Course: {params.slug}</h1>
      <p className="text-gray-600 dark:text-gray-400">This page can show overview and syllabus.</p>
    </div>
  );
}
