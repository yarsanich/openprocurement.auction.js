export default function formatnumber(filter) {
  return function(val) {
    return (filter('number')(val) || "").replace(/,/g, " ") || "";
  };
}
