import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UserProfilePage } from "@/components/user-profile-page"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <UserProfilePage />
      <Footer />
    </div>
  )
}
