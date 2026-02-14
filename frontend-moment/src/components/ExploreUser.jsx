import SidebarRightSide from "./SidebarRightSide";

const ExploreUsers = () => {
  return (
    <div className="p-4 text-white w-full max-h-screen">
      <h1 className="text-xl font-semibold mb-4">
        Explore Users
      </h1>

      <SidebarRightSide showOnMobile />
    </div>
  );
};

export default ExploreUsers;
