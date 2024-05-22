import React from 'react';
import { DrupalNode } from "next-drupal"
import Image from "next/image"
import { absoluteUrl, formatDate } from "lib/utils"
import {searchFields} from "../search-fields/search-fields"

interface NodeArticleProps {
    node: DrupalNode
    nameImage: string
}

// nameImage is the field where the name of the image field is saved.
export function NodeContentType({ node, nameImage, ...props }: NodeArticleProps) {

    var nameFieldImage =  searchFields(nameImage, node)

    return (
        <article {...props}>
            <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
            <div className="mb-4 text-gray-600">
                {node.uid?.display_name ? (
                    <span>
                        Posted by{" "}
                        <span className="font-semibold">{node.uid?.display_name}</span>
                    </span>
                ) : null}
                <span> - {formatDate(node.created)}</span>
            </div>
            {nameFieldImage && (
                <figure>
                    <Image
                        src={absoluteUrl(nameFieldImage.uri.url)}
                        width={768}
                        height={400}
                        alt={nameFieldImage.resourceIdObjMeta.alt}
                        priority
                    />
                    {nameFieldImage.resourceIdObjMeta.title && (
                        <figcaption className="py-2 text-sm text-center text-gray-600">
                            {nameFieldImage.resourceIdObjMeta.title}
                        </figcaption>
                    )}
                </figure>
            )}
            {node.body?.processed && (
                <div
                    dangerouslySetInnerHTML={{ __html: node.body?.processed }}
                    className="mt-6 font-serif text-xl leading-loose prose"
                />
            )}
        </article>)
}
