import NavigationBarAdmin from "@/components/navigation/navigation-bar-admin";
import { Square2StackIcon, UserIcon } from "@heroicons/react/24/outline";

import ModalProvider from "@/components/provider/modal-provider";
import TableProvider from "@/components/provider/table-provider";
import { SelectedPageProvider } from "@/components/navigation/navigation-provider";

const items = [
  {
    id: 1,
    name: "Users",
    icon: <UserIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />,
  },
  {
    id: 2,
    name: "Sports",
    icon: (
      <Square2StackIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 3,
    name: "Leagues",
    icon: (
      <Square2StackIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 4,
    name: "Teams",
    icon: (
      <Square2StackIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 5,
    name: "Matches",
    icon: (
      <Square2StackIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 6,
    name: "Replays",
    icon: (
      <Square2StackIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
];

const Home = () => {
  return (
    <SelectedPageProvider initialPage="Users">
      <main className="w-full h-screen flex flex-row relative bg-white overflow-hidden">
        <div className="flex flex-col bg-gray-100 h-screen overflow-y-auto min-w-[200px]">
          <NavigationBarAdmin items={items} />
        </div>
        <section className="flex flex-col flex-1 p-8 overflow-y-auto items-center justify-center gap-5 ">
          <ModalProvider />
          <TableProvider />
        </section>
      </main>
    </SelectedPageProvider>
  );
};

export default Home;
