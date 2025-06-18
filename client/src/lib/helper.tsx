export function formatDuration(minutes) {
  // Lấy số nguyên phút
  const totalSeconds = Math.round(minutes * 60); // Chuyển phút thành giây
  const hours = Math.floor(totalSeconds / 3600); // Tính giờ
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60); // Tính phút còn lại
  const seconds = totalSeconds % 60; // Tính giây còn lại

  // Định dạng chuỗi
  if (hours > 0) {
    return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${remainingMinutes}:${seconds.toString().padStart(2, "0")}`;
}
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const formatTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

export const formatDateFull = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const adjustToVietnamTime = (date: Date): Date => {
  const vietnamDate = new Date(date);
  vietnamDate.setHours(vietnamDate.getHours()); // Điều chỉnh từ UTC sang UTC+07:00
  return vietnamDate;
};
