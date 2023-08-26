import { useState, useRef, useLayoutEffect, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [focusItem, setFocusItem] = useState(new Date().getFullYear());
  const [nextScrollReset, setNextScrollReset] = useState("start");
  const rangeAround = 12;
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const lowerLimitRef = useRef(null);
  const focusItemRef = useRef(null);
  const upperLimitRef = useRef(null);

  const items = [];
  for (let i = focusItem - rangeAround; i <= focusItem + rangeAround; i++) {
    items.push(i);
  }

  const itemList = items.map((item, index) => {
    if (index === 0) {
      return (
        <div key={item} ref={lowerLimitRef} className="block">
          {item}
        </div>
      );
    }

    if (index === rangeAround) {
      return (
        <div key={item} ref={focusItemRef} className="block">
          {item}
        </div>
      );
    }

    if (index === items.length - 1) {
      return (
        <div key={item} ref={upperLimitRef} className="block">
          {item}
        </div>
      );
    }

    return (
      <div key={item} className="block">
        {item}
      </div>
    );
  });

  useLayoutEffect(() => {
    focusItemRef.current.scrollIntoView({
      behavior: "instant",
      block: nextScrollReset
    });
  }, [focusItem, nextScrollReset]);

  useEffect(() => {
    const container = containerRef.current;
    const lowerLimitNode = lowerLimitRef.current;
    const upperLimitNode = upperLimitRef.current;
    if (!container || !lowerLimitNode || !upperLimitNode) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const { target } = entry;

        if (target === lowerLimitNode) {
          setFocusItem((prev) => prev - rangeAround);
          setNextScrollReset("start");
        }

        if (target === upperLimitNode) {
          setFocusItem((prev) => prev + rangeAround);
          setNextScrollReset("end");
        }
      });
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: container,
      threshold: 1
    });

    observerRef.current.observe(lowerLimitNode);
    observerRef.current.observe(upperLimitNode);

    return () => {
      observerRef.current.disconnect();
    };
  }, [focusItem]);

  console.log(itemList);

  return (
    <div className="App">
      <div ref={containerRef} className="scroll-container">
        {itemList}
      </div>
    </div>
  );
}
