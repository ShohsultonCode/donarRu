import React, { useEffect } from 'react';
import './index.css'

const index = () => {
    useEffect(() => {
        const h1 = document.querySelector("h1");
        const offset = h1.getBoundingClientRect();
        const cursor = document.querySelector(".cursor");

        document.body.onmousemove = function (e) {
            /* Adjust the cursor position */
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";

            const x = e.clientX - offset.left;
            const y = e.clientY - offset.top;

            /* Adjust the clip-path */
            h1.style.setProperty("--x", x + "px");
            h1.style.setProperty("--y", y + "px");
        };
    }, []);

    return (
        <div className="all">
            <h1 data-text="Page not found" className='titles'>Page not found</h1>
            <span className="cursor"></span>
        </div>
    );
}

export default index;
