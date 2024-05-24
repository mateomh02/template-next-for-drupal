import React from 'react';
import { DrupalNode } from "next-drupal"
import Image from "next/image"
import { absoluteUrl, formatDate } from "lib/utils"
import { searchFields } from "../search-fields/search-fields"
import { getContentType } from '../pages/api/apiContentType'
import { useEffect, useState } from 'react';
import String from './field-content-types/string'
import Path from './field-content-types/path'
import Link from 'next/link';
interface NodeArticleProps {
  node: DrupalNode
  nameImage: string
}

// nameImage is the field where the name of the image field is saved.
export function NodeContentType({ node, nameImage, ...props }: NodeArticleProps) {
  var nameFieldImage = searchFields(nameImage, node)
  const [typesFields, setTypesFields] = useState([])
  // contentType()
  //Quedo para traer los tipos de contenidos
  useEffect(()=>{
    async function uploadDate() {
      const type = await contentType(node)
      setTypesFields(type)
    }
    uploadDate()
  }, [])

  var dataTypeFields = []
  Object.keys(node).map((i)=>{
    typesFields.map((e)=>{

      if(i==e.name_system){
        dataTypeFields.push({
          type:e.type,
          nameSystem:e.name_system,
          info: node[i]
        })
      }
    })
  })

  // dataTypeFields.map((i)=>{
  //   // console.log(i.type)

  // })

  return (<div>
    {/* <article {...props}>
      <Link href={'blog/test-field-text'}>HOLAA</Link>
      <h1 className="mb-4 text-6xl font-black leading-tight text-center">{node.title}</h1>
      {nameFieldImage && (
        <figure className='flex justify-center'>
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
      <div className="mb-4 text-gray-600">
        {node.uid?.display_name ? (
          <span>
            Posted by{" "}
            <span className="font-semibold">{node.uid?.display_name}</span>
          </span>
        ) : null}
        <span> - {formatDate(node.created)}</span>
      </div>
    </article> */}
    <div {...props}>
      {dataTypeFields.map((i, index)=>{

        if(i.type=='string'){
          return(<String key={index} valueInfo={i.info} type={i.nameSystem}/>)
        }else if(i.type=='link'){
          {console.log('ENTRA A LINK')}
          return(<Path key={index} path={i.info}/>)
        }
      })}
    </div>
  </div>)
}

async function contentType(node){
  const contentType = await getContentType()
  const result = []
  const typeContent= node.type.split('--')[1]
  const contentTypeNode  = (contentType[typeContent])
  for(const e in contentTypeNode.fields){
    if('display_weight' in contentTypeNode.fields[e]){
      result.push({
        name_system: e,
        type:contentTypeNode.fields[e].type
      })
    }
  }
  return result
}
