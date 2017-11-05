"use strict";
import React from "react";

export default function Comment() {
    return <div className="comment">
        <div className="body">Hola mundo</div>
        <div className="comment">
            <div className="body">Comentario hijo</div>
        </div>
    </div>;
}