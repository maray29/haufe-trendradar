import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animateDiagramDesktop() {
  const drawingContainer = document.querySelector('.haufe-trendradar');
  // Fetch the svg from github and append to the embed div
  const diagram =
    'https://gist.githubusercontent.com/maray29/e78f6255dd37f1651ac6ddd97cebba1b/raw/bed745e1dfafd0fc2a0edd10f254483aa8e31972/haufe-trendradar.html';

  fetch(diagram)
    .then((response) => response.text())
    .then((data) => {
      // const terrainLines = document.querySelector(".terrain-lines");
      drawingContainer.insertAdjacentHTML('beforeend', data);
    })
    .then((data) => {
      const elements = document.querySelector('.haufe-trendradar');
      const lines = document.querySelector('.lines');
      const learningAndDev = document.querySelector('.learning-and-dev');
      const agileTransformation = document.querySelector('.agile-transformation');

      // Starting point: selection of elements
      const layers = Array.from(document.querySelectorAll('[class^="layer-"]'));

      // Function to extract the number from the class name of an SVG element
      const extractNumber = (element) => {
        // Accessing className for SVG elements
        const className = element.className.baseVal;
        const match = className.match(/layer-(\d+)/);
        return match ? parseInt(match[1], 10) : null;
      };

      // Grouping the SVG elements by the extracted number
      const groupedLayers = layers.reduce((acc, el) => {
        // Extract number from class name
        const num = extractNumber(el);
        if (num !== null) {
          // Initialize the group array if it doesn't exist
          if (!acc[num]) acc[num] = [];
          // Add the element to the correct group
          acc[num].push(el);
        }
        return acc;
      }, {});

      gsap.set('.additional-text', {
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: drawingContainer,
          start: 'top top',
        },
      });

      tl.from(['.group-1'], {
        autoAlpha: 0,
      })
        .from(['.group-2'], {
          autoAlpha: 0,
        })
        .from(['.group-3'], {
          autoAlpha: 0,
        })
        .from(['.group-4'], {
          autoAlpha: 0,
        });
      // .from(groupedLayers, {
      //   autoAlpha: 0,
      //   stagger: 0.1,
      // })
      // Duration of the animation for each element
      const duration = 1; // 1 second for demonstration

      // Delay between each group's animation
      const groupDelay = 0.05; // Half a second delay

      // Iterate over each group of elements
      Object.keys(groupedLayers).forEach((group, index) => {
        // Calculate the delay for the current group based on its index
        const delay = index * groupDelay;

        // Animate each group separately
        tl.from(
          groupedLayers[group],
          {
            duration: 0.35,
            autoAlpha: 0, // Example: animate to full opacity
            stagger: 0.02, // Stagger the start time of each element's animation within the group
            delay: 0, // Delay the start of the animation for the current group
          },
          '<0.15'
        );
      });
      tl.from(
        [
          '.learning-and-dev-text',
          '.agile-transformation-text',
          '.ai-strategy-text',
          '.digital-transformation-text',
          '.data-intelligence-text',
          '.advances-cybersecurity-text',
          '.innovation-text',
          '.sustainability-management-text',
          '.global-talent-text',
          '.people-culture-text',
        ],
        {
          autoAlpha: 0,
        }
      );

      const groups = gsap.utils.toArray([
        '.global-talent',
        '.sustainability-management',
        '.people-culture',
        '.digital-transformation',
        '.data-intelligence',
        '.ai-strategy',
        '.agile-transformation',
        '.learning-and-dev',
        '.advances-cybersecurity',
        '.innovation',
      ]);

      // const bubbles = gsap.utils.toArray(['.bubble']);

      function animateBubbleOnHover(el) {
        groups.forEach((group) => {
          const rect = group.getBBox();
          const additionalText = group.querySelector('.additional-text');
          const bubble = group.querySelector('.bubble');
          if (group !== el) {
            gsap.to(group, { autoAlpha: 0.1, duration: 0.5 });
            // group.style.pointerEvents = 'none';
          } else {
            gsap.set(group, { transformOrigin: '50% 50%' });
            gsap.to(group, { scale: 1.2 });
            gsap.to(additionalText, { autoAlpha: 1, duration: 0.5, delay: 0.25 });
          }
        });
      }

      groups.forEach((group) => {
        const rect = group.getBBox();
        console.log('Rect: ', rect);
        const bubble = group.querySelector('.bubble');
        const additionalText = group.querySelector('.additional-text');
        bubble.addEventListener('mouseenter', () => {
          animateBubbleOnHover(group);
        });
        bubble.addEventListener('mouseleave', () => {
          gsap.to(groups, { autoAlpha: 1, scale: 1, duration: 0.5 }); // Reset all bubbles to full opacity
          gsap.to('.additional-text', { autoAlpha: 0, duration: 0.5 });
          // groups.forEach((resetBubble) => {
          //   resetBubble.style.pointerEvents = 'auto';
          // });
        });
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

window.addEventListener('DOMContentLoaded', () => {
  animateDiagramDesktop();
});
