import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  name: string;
  selectedItem?: string | null;
}

const NavigationLink = ({ children, name, selectedItem }: Props) => {
  const navigate = useNavigate();
  return (
    <a
      onClick={() => navigate("/")}
      className={`${
        selectedItem === name
          ? "flex p-1 rounded cursor-pointer stroke-[0.75] stroke-neutral-400  place-items-center gap-3 bg-slate-300/60 transition-colors duration-100"
          : "flex p-1 rounded cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 place-items-center gap-3 hover:bg-gray-300/50 transition-colors duration-100"
      }`}
    >
      {children}
      <p className="text-[15px] font-poppins overflow-clip truncate whitespace-nowrap tracking-wide font-medium">
        {name}
      </p>
    </a>
  );
};

export default NavigationLink;
