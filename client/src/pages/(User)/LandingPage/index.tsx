import React, { useState } from "react";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-2 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-yellow-400 font-bold text-xl mr-2">9BET</span>
          <span className="text-white text-xs">CƯỢC HẠT THƯỞNG KHỦNG</span>
          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded ml-2">
            +1,6%
          </span>
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded ml-2">
            ĐĂNG KÝ
          </span>
        </div>
        <div className="flex items-center">
          <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center mr-2">
            <i className="fas fa-headset mr-1"></i>
            TRỰC TUYẾN
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-800 py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className={`text-sm ${
                activeTab === "home" ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 cursor-pointer whitespace-nowrap`}
              onClick={() => setActiveTab("home")}
            >
              Trang Chủ
            </a>
            <a
              href="#"
              className={`text-sm ${
                activeTab === "register" ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 cursor-pointer whitespace-nowrap`}
              onClick={() => setActiveTab("register")}
            >
              Đăng Ký
            </a>
            <a
              href="#"
              className={`text-sm ${
                activeTab === "login" ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 cursor-pointer whitespace-nowrap`}
              onClick={() => setActiveTab("login")}
            >
              Đăng Nhập
            </a>
            <a
              href="#"
              className={`text-sm ${
                activeTab === "guide" ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 cursor-pointer whitespace-nowrap`}
              onClick={() => setActiveTab("guide")}
            >
              Hướng Dẫn
            </a>
            <a
              href="#"
              className={`text-sm ${
                activeTab === "promotion" ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 cursor-pointer whitespace-nowrap`}
              onClick={() => setActiveTab("promotion")}
            >
              Khuyến Mãi
            </a>
            <a
              href="#"
              className={`text-sm ${
                activeTab === "news" ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 cursor-pointer whitespace-nowrap`}
              onClick={() => setActiveTab("news")}
            >
              Tin Tức
            </a>
            <a
              href="#"
              className={`text-sm ${
                activeTab === "app" ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 cursor-pointer whitespace-nowrap`}
              onClick={() => setActiveTab("app")}
            >
              Ứng Dụng
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-transparent border border-gray-600 text-gray-300 text-xs px-2 py-1 rounded !rounded-button cursor-pointer whitespace-nowrap">
              <i className="fas fa-globe mr-1"></i> VI
            </button>
            <button className="bg-transparent border border-gray-600 text-gray-300 text-xs px-2 py-1 rounded !rounded-button cursor-pointer whitespace-nowrap">
              <i className="fas fa-search mr-1"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=Sports%20players%20in%20action%2C%20football%20soccer%20basketball%20players%20in%20dynamic%20poses%20on%20dark%20background%2C%20atmospheric%20lighting%2C%20dramatic%20sports%20scene%20with%20high%20contrast%2C%20professional%20athletes&width=1440&height=500&seq=1&orientation=landscape')] bg-cover bg-center opacity-40"></div>
        <div className="container mx-auto relative z-20 py-16 px-4">
          <div className="max-w-2xl">
            <div className="text-green-500 font-bold mb-2">
              THƯỞNG TỶ LỆ THẮC THẮP THẮNG
            </div>
            <h1 className="text-3xl font-bold mb-4">
              XEM TRỰC TIẾP TẤT CẢ CÁC TRẬN ĐẤU, NHANH SỐ, KHÔNG QUẢNG CÁO,
              KHÔNG GIẬT LAG
            </h1>
            <p className="text-gray-300 mb-6">
              Thưởng thức các trận đấu hấp dẫn nhất từ các giải đấu hàng đầu thế
              giới với chất lượng cao và không có quảng cáo làm phiền bạn.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold !rounded-button cursor-pointer whitespace-nowrap">
              XEM NGAY
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto mb-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center cursor-pointer">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl font-bold">TV1</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 w-full rounded !rounded-button cursor-pointer whitespace-nowrap">
              Xem Ngay
            </button>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center cursor-pointer">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl font-bold">TV2</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 w-full rounded !rounded-button cursor-pointer whitespace-nowrap">
              Xem Ngay
            </button>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center cursor-pointer">
            <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl font-bold">TV3</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 w-full rounded !rounded-button cursor-pointer whitespace-nowrap">
              Xem Ngay
            </button>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center cursor-pointer">
            <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl font-bold">TV4</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 w-full rounded !rounded-button cursor-pointer whitespace-nowrap">
              Xem Ngay
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 max-w-4xl mx-auto">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
            Đăng Ký
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
            Đăng Nhập
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
            Nạp Tiền
          </button>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
            Rút Tiền
          </button>
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
            Liên Hệ
          </button>
        </div>
      </div>

      {/* Featured Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-center mb-6">
          GIẢI LỊCH TRỰC TIẾP CÁC TRẬN ĐẤU BÓNG ĐÁ, TENNIS, BÓNG RỔ <br /> KHÔNG
          CẦN ĐĂNG KÝ TÀI KHOẢN
        </h2>

        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
            <img
              src="https://readdy.ai/api/search-image?query=Live%20football%20match%20with%20players%20in%20action%2C%20intense%20gameplay%20moment%2C%20stadium%20atmosphere%2C%20broadcast%20quality%20view%2C%20sports%20streaming%20perspective%2C%20dynamic%20soccer%20scene&width=300&height=200&seq=2&orientation=landscape"
              alt="Trận đấu bóng đá"
              className="w-full h-48 object-cover rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded opacity-90 !rounded-button cursor-pointer whitespace-nowrap">
                <i className="fas fa-play mr-2"></i> Xem Ngay
              </button>
            </div>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
            <img
              src="https://readdy.ai/api/search-image?query=Tennis%20match%20live%20broadcast%20view%2C%20professional%20players%20in%20action%2C%20court%20perspective%2C%20high%20quality%20streaming%20visual%2C%20sports%20broadcast%20frame%20with%20dynamic%20tennis%20play&width=300&height=200&seq=3&orientation=landscape"
              alt="Trận đấu tennis"
              className="w-full h-48 object-cover rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded opacity-90 !rounded-button cursor-pointer whitespace-nowrap">
                <i className="fas fa-play mr-2"></i> Xem Ngay
              </button>
            </div>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
            <img
              src="https://readdy.ai/api/search-image?query=Basketball%20game%20live%20streaming%20view%2C%20professional%20players%20in%20action%20on%20court%2C%20broadcast%20quality%20frame%2C%20dynamic%20basketball%20play%20moment%2C%20sports%20streaming%20perspective%20with%20clear%20view%20of%20game&width=300&height=200&seq=4&orientation=landscape"
              alt="Trận đấu bóng rổ"
              className="w-full h-48 object-cover rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded opacity-90 !rounded-button cursor-pointer whitespace-nowrap">
                <i className="fas fa-play mr-2"></i> Xem Ngay
              </button>
            </div>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
            <img
              src="https://readdy.ai/api/search-image?query=Live%20sports%20broadcast%20interface%2C%20multiple%20games%20on%20screen%2C%20sports%20streaming%20platform%20view%2C%20high%20quality%20broadcast%20visual%20with%20game%20selection%20interface%2C%20modern%20sports%20viewing%20experience&width=300&height=200&seq=5&orientation=landscape"
              alt="Nhiều trận đấu"
              className="w-full h-48 object-cover rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded opacity-90 !rounded-button cursor-pointer whitespace-nowrap">
                <i className="fas fa-play mr-2"></i> Xem Ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Reviews */}
      <div className="container mx-auto px-4 py-8 bg-gray-800 rounded-lg my-8">
        <h2 className="text-xl font-bold text-center mb-6">
          SỰ HÀI LÒNG BẠN, ĐIỀU LUÔN ĐƯỢC ĐẶT TRÊN THAPCANTVZ
        </h2>
        <p className="text-center text-gray-300 mb-8">
          Chúng tôi luôn cố gắng mang đến trải nghiệm xem trực tiếp thể thao tốt
          nhất cho người dùng. Hãy xem những gì mọi người nói về dịch vụ của
          chúng tôi.
        </p>

        <div className="grid grid-cols-5 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Minh Tuấn</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Quang Huy</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Hồng Nhung</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-yellow-600 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Văn Toàn</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Thu Hương</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6 max-w-4xl mx-auto mt-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Thanh Hà</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Đức Anh</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Ngọc Linh</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Minh Đức</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center mb-2">
              <i className="fas fa-user text-xl"></i>
            </div>
            <p className="text-sm text-center">Lan Anh</p>
          </div>
        </div>
      </div>

      {/* Information Blocks */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">ThapCamTV là gì?</h2>
          <p className="text-gray-300 mb-4">
            ThapCamTV là nền tảng trực tuyến cung cấp dịch vụ xem trực tiếp các
            trận đấu thể thao từ nhiều giải đấu hàng đầu thế giới. Chúng tôi
            cung cấp dịch vụ xem trực tiếp với chất lượng cao, không quảng cáo,
            không giật lag, giúp người hâm mộ thể thao có thể thưởng thức các
            trận đấu một cách trọn vẹn nhất.
          </p>
          <p className="text-gray-300">
            Với ThapCamTV, bạn có thể xem trực tiếp các trận đấu bóng đá từ các
            giải đấu lớn như Premier League, La Liga, Serie A, Bundesliga, Ligue
            1, Champions League, Europa League, World Cup, Euro, Copa America,
            và nhiều giải đấu khác. Ngoài ra, chúng tôi còn cung cấp dịch vụ xem
            trực tiếp các môn thể thao khác như tennis, bóng rổ, bóng chuyền,
            v.v.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">
            Tại sao nên chọn xem trực tiếp tại ThapCamTV?
          </h2>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Chất lượng hình ảnh cao, âm thanh rõ ràng, không giật lag.</li>
            <li>Không có quảng cáo làm phiền trong quá trình xem trận đấu.</li>
            <li>Giao diện đơn giản, dễ sử dụng, thân thiện với người dùng.</li>
            <li>
              Hỗ trợ xem trên nhiều thiết bị: máy tính, điện thoại, tablet.
            </li>
            <li>
              Cập nhật lịch trực tiếp các trận đấu một cách nhanh chóng và đầy
              đủ.
            </li>
            <li>
              Không cần đăng ký tài khoản, không cần đăng nhập, chỉ cần truy cập
              vào trang web là có thể xem ngay.
            </li>
          </ul>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">
            Hướng dẫn sử dụng ThapCamTV
          </h2>
          <ol className="list-decimal pl-6 text-gray-300 space-y-2">
            <li>Truy cập vào trang web ThapCamTV.</li>
            <li>
              Chọn trận đấu bạn muốn xem từ danh sách các trận đấu đang diễn ra
              hoặc sắp diễn ra.
            </li>
            <li>Nhấp vào nút "Xem Ngay" để bắt đầu xem trực tiếp.</li>
            <li>Tận hưởng trận đấu với chất lượng hình ảnh tốt nhất.</li>
          </ol>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            Câu hỏi thường gặp về ThapCamTV
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-yellow-400">
                ThapCamTV có tính phí không?
              </h3>
              <p className="text-gray-300">
                Không, ThapCamTV hoàn toàn miễn phí. Bạn không cần phải trả bất
                kỳ khoản phí nào để xem các trận đấu trực tiếp trên nền tảng của
                chúng tôi.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-400">
                Tôi có cần đăng ký tài khoản để xem trực tiếp trên ThapCamTV
                không?
              </h3>
              <p className="text-gray-300">
                Không, bạn không cần phải đăng ký tài khoản để xem trực tiếp
                trên ThapCamTV. Chỉ cần truy cập vào trang web và chọn trận đấu
                bạn muốn xem.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-400">
                ThapCamTV có hỗ trợ xem trên điện thoại không?
              </h3>
              <p className="text-gray-300">
                Có, ThapCamTV hỗ trợ xem trên mọi thiết bị có kết nối internet,
                bao gồm điện thoại, máy tính bảng, máy tính, và smart TV.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-400">
                Tại sao video bị giật lag?
              </h3>
              <p className="text-gray-300">
                Nếu bạn gặp vấn đề về giật lag, có thể do kết nối internet của
                bạn không ổn định. Hãy kiểm tra lại kết nối internet và thử làm
                mới trang web.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-500 text-black text-xl font-bold px-4 py-2 rounded">
              TRỰC TUYẾN
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm">
            © 2025 ThapCamTV. Tất cả các quyền được bảo lưu. Trang web này không
            lưu trữ bất kỳ tệp video nào trên máy chủ của mình. Tất cả nội dung
            được cung cấp bởi các bên thứ ba không liên kết với ThapCamTV.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
