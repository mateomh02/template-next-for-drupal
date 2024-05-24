import { GetStaticPathsResult, GetStaticPropsResult } from "next"
import Head from "next/head"
import { DrupalNode } from "next-drupal"

import { drupal } from "lib/drupal"
import { NodeArticle } from "components/node--article"
import { NodeContentType } from "components/node--new-content-type"
import { NodeBasicPage } from "components/node--basic-page"
import { Layout } from "components/layout"
import { getContentType } from './api/apiContentType'

const RESOURCE_TYPES = ["node--article"]

interface NodePageProps {
  resource: DrupalNode;
  contentTypeNews: String[];
  nameFieldImage: string;
}

export default function NodePage({ resource, contentTypeNews, nameFieldImage }: NodePageProps) {
  if (!resource) return null
  return (
    <Layout>
      <Head>
        <title>{resource.title}</title>
        <meta name="description" content="A Next.js site powered by Drupal." />
      </Head>
      {/* {resource.type === "node--article" && <NodeArticle node={resource} />}  */}
      {<NodeContentType node={resource} nameImage={nameFieldImage}/>}
    </Layout>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  return {
    paths: await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context),
    fallback: "blocking",
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<NodePageProps>> {
  const path = await drupal.translatePathFromContext(context)
  const contentType = await getContentType();
  const contentTypeNews = Object.keys(contentType)
  if (!path) {
    return {
      notFound: true,
    }
  }

  const type = path.jsonapi.resourceName

  let params = {}
  // if (type === "node--article" || "node--motos") {
  // params = {
  //   include: "field_image,uid",
  // }
  // }

  var nameFieldImage = ''
  Object.keys(contentType).map(async (i) => {
    if (i == path.entity.bundle) {
      Object.keys(contentType[i].fields).map((e) => {
        if (contentType[i].fields[e].type == 'image') {
          console.log(e) // Nombre del sistema
          nameFieldImage = e
          params = {
            include: "uid,"+e,
          }
        }
      })
    }
  })


  const resource = await drupal.getResourceFromContext<DrupalNode>(
    path,
    context,
    {
      params,
    }
  )
  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wrong on Drupal.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation can try again on next request.
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      resource,
      contentTypeNews,
      nameFieldImage,
    },
  }
}
