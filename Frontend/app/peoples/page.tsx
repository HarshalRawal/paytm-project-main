import { PeopleList } from "@/components/peoples/people-list"
export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-4 pt-8">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">
          People
        </h1>
        <PeopleList />
      </div>
    </div>
  )
}

