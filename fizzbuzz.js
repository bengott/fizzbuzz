if (Meteor.isClient) {
  // counter starts at 0
  Session.set("clickCount", 0);

  Template.main.clickCount = function() {
    return Session.get('clickCount');
  }

  Template.main.rendered = function() {
    var template = this;
    var context = famous.core.Engine.createContext(this.firstNode);
    var PE = new famous.physics.PhysicsEngine();

    // Create a surface, content is html
    var surface = new famous.core.Surface({
      size: [100, 100],
      content: "<span>Click Me!</span>",
      classes: ["test-surface"]
    });

    // Create a physical particle with position (p), velocity (v), mass(m)
    var particle = new famous.physics.bodies.Particle({
      mass: 1,
      position: [0, 0, 0],
      velocity: [0, 0, 0]
    });

    // Create a spring that will act on the particle
    var spring = new famous.physics.forces.Spring({
      anchor: [0, 0, 0],
      period: 200,  // <= Play with these values :-)
      dampingRatio: 0.1, // <=
      length: 0
    });

    // Link the spring, particle and surface together
    PE.attach(spring, particle);
    PE.addBody(particle);

    var modifier = new famous.core.Modifier({ origin: [.5, .5] });

    // Create the scene, applying a top level modifier to center
    // the scene vertically in the viewport
    context.add(modifier).add(particle).add(surface);
    context.setPerspective(1000);


    // Apply a force on the surface when it's clicked
    surface.on("click", function (e) {

      Session.set("clickCount", Session.get("clickCount") + 1);
      var output = fizzBuzz(Session.get("clickCount"));
      surface.setContent("<span>" + output + "</span>");

      if (output === "Fizz") {
        particle.applyForce(new famous.math.Vector(0, 0.05, 0));
      }
      if (output === "Buzz") {
        modifier.setTransform(famous.core.Transform.rotateZ(0.05));
        var transition = {
          method: famous.transitions.SpringTransition,
          period: 200,
          dampingRatio: 0.1,
          velocity: 0
        }
        modifier.setTransform(famous.core.Transform.rotateZ(0), transition);
      }
      if (output === "FizzBuzz") {
        modifier.setTransform(famous.core.Transform.rotateZ(Math.PI / 8));
        var transition = {
          method: famous.transitions.SpringTransition,
          period: 100,
          dampingRatio: 0.2,
          velocity: 0
        }
        modifier.setTransform(famous.core.Transform.rotateZ(0), transition);
      }
    });
  }

  function fizzBuzz (number) {

    var string = '';

    if (number > 0) {
      // Adapted from https://en.wikipedia.org/wiki/Fizz_buzz
      // ---------------------------------------------------
      if (number % 3 === 0) {
        string += 'Fizz';
      }

      if (number % 5 === 0) {
        string += 'Buzz';
      }

      // If `string` is empty, `count` is not divisible
      // by 3 or 5, so use the number instead.
      if (string === '') {
        string += number;
      }
      // ---------------------------------------------------
    }

    return string;
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
