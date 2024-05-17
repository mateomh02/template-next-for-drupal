import React from 'react';
import { DrupalNode } from "next-drupal"

interface nodeContentType {
    node: DrupalNode
}

export function NodeContentType({node, ...props}: nodeContentType){
    return(<>
        <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
    </>)
}