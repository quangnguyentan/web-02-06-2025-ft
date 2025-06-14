import image_404 from "@/assets/admin/404.png";
const index = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <img src={image_404} alt="404" className="w-full h-screen" />
    </div>
  );
};

export default index;
