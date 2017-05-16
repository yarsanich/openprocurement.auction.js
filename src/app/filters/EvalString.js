export default function eval_string(filter) {
  return function(val) {
    return math.eval(val);
  };
}
