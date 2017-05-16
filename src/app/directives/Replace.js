export default function nghReplace($compile, $parse, $rootScope) {
  return {
    replace: true,
    link: function(scope, element, attr) {
      scope.$watch(attr.content, function() {
        element.html($parse(attr.content)(scope));
        $compile(element.contents())(scope);
      }, true);
    }
  };
}

