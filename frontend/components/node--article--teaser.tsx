import Image from "next/image"
import Link from "next/link"
import { DrupalNode } from "next-drupal"

import { absoluteUrl, formatDate } from "lib/utils"
import FieldImage from '../lib/interface';
import {searchFields} from "../search-fields/search-fields"
interface NodeArticleTeaserProps {
  node: DrupalNode
  FieldImage: string[]
}

export function NodeArticleTeaser({ node, FieldImage, ...props }: NodeArticleTeaserProps) {

  var contentSelect
  Object.keys(node).map((i)=>{
    FieldImage.map((e)=>{
      if(i==e){
        contentSelect = searchFields(e, node)
      }
    })
  })
  return (
    <article {...props}>
      <Link href={node.path.alias ?? '/'} className="no-underline hover:text-blue-600">
        <h2 className="mb-4 text-4xl font-bold">{node.title}</h2>
      </Link>
      <div className="mb-4 text-gray-600">
        {node.uid?.display_name ? (
          <span>
            Posted by{" "}
            <span className="font-semibold">{node.uid?.display_name}</span>
          </span>
        ) : null}
        <span> - {formatDate(node.created)}</span>
      </div>
      {contentSelect && (
        <figure className="my-4">
          <Image
            src={absoluteUrl(contentSelect?.uri.url)}
            width={768}
            height={480}
            alt={contentSelect?.resourceIdObjMeta.alt}
            priority
          />
        </figure>
      )}
      <Link
        href={node.path.alias ?? '/'}
        className="inline-flex items-center px-6 py-2 border border-gray-600 rounded-full hover:bg-gray-100"
      >
        Read article
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 ml-2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  )
}
