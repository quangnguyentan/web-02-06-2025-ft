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
