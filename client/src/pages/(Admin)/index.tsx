import NavigationBarAdmin from "@/components/navigation/navigation-bar-admin";
import ModalProvider from "@/components/provider/modal-provider";
import TableProvider from "@/components/provider/table-provider";
import { SelectedPageProvider } from "@/components/navigation/navigation-provider";
import HeaderAdmin from "@/components/header-admin";
import {
  ArrowPathIcon,
  BanknotesIcon,
  CalendarDateRangeIcon,
  GlobeAsiaAustraliaIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

const items = [
  {
    id: 1,
    name: "Users",
    icon: <UsersIcon className="stroke-white stroke-[1] min-w-5 w-5" />,
  },
  {
    id: 2,
    name: "Sports",
    icon: (
      <GlobeAsiaAustraliaIcon className="stroke-white stroke-[1] min-w-5 w-5" />
    ),
  },
  {
    id: 3,
    name: "Leagues",
    icon: (
      <CalendarDateRangeIcon className="stroke-white stroke-[1] min-w-5 w-5" />
    ),
  },
  {
    id: 4,
    name: "Teams",
    icon: <UserGroupIcon className="stroke-white stroke-[1] min-w-5 w-5" />,
  },
  {
    id: 5,
    name: "Matches",
    icon: <BanknotesIcon className="stroke-white stroke-[1] min-w-5 w-5" />,
  },
  {
    id: 6,
    name: "Replays",
    icon: <ArrowPathIcon className="stroke-white stroke-[1] min-w-5 w-5" />,
  },
];

const Home = () => {
  return (
    <SelectedPageProvider initialPage="Users">
      <main className="w-full h-screen flex flex-col relative bg-white overflow-hidden ">
        <HeaderAdmin />
        <div className="flex flex-row flex-1 overflow-hidden">
          <div className="flex flex-col bg-gray-800 text-white h-full overflow-y-auto min-w-[200px] sticky z-50">
            <NavigationBarAdmin items={items} />
          </div>
          <section className="flex flex-col flex-1 p-8 overflow-y-auto items-center justify-center gap-5">
            <ModalProvider />
            <TableProvider />
          </section>
        </div>
      </main>
    </SelectedPageProvider>
  );
};

export default Home;
