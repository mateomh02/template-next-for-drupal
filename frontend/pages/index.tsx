import Head from "next/head"
import { GetStaticPropsResult } from "next"
import { DrupalNode } from "next-drupal"

import { drupal } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeArticleTeaser } from "components/node--article--teaser"

import { getContentType } from './api/apiContentType'
import FieldImage from '../lib/interface';

interface IndexPageProps {
  // nodes: DrupalNode[]
  // basicPage: DrupalNode[]
  contentTypeNewsPromises: DrupalNode[]
  nameFieldImage: string[]
}

export default function IndexPage({ contentTypeNewsPromises, nameFieldImage }: IndexPageProps) {
  console.log(contentTypeNewsPromises)
  return (
    <Layout>
      <Head>
        <title>Next.js for Drupal</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div>
        <h1 className="mb-10 text-6xl font-black">Latest Articles.</h1>
        {contentTypeNewsPromises?.length ? (
          contentTypeNewsPromises.map((node) => (

            <div key={node.id}>
              <NodeArticleTeaser node={node} FieldImage={nameFieldImage} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<IndexPageProps>> {
  // const nodes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
  //   "node--article",
  //   context,
  //   {
  //     params: {
  //       "filter[status]": 1,
  //       "fields[node--article]": "title,path,field_image,uid,created",
  //       include: "field_image,uid",
  //       sort: "-created",
  //     },
  //   }
  // )
  // const basicPage = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
  //   "node--page",
  //   context,
  //   {
  //     params: {
  //       "filter[status]": 1,
  //       "fields[node--page]": "title,path,uid,created",
  //       include: "uid",
  //       sort: "-created",
  //     },
  //   }
  // )

  // const newContentType = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
  //   "node--article",
  //   context,
  //   {
  //     params: {
  //       "filter[status]": 1,
  //       "fields[node--page]": "title,path,uid,created",
  //       include: "uid",
  //       sort: "-created",
  //     },
  //   }
  // )
  var nameFieldImage = []
  const contentType = await getContentType();
  const contentTypeNewsPromises: DrupalNode[][] = await Promise.all(Object.keys(contentType).map(async (i) => {
    const fields = Object.keys(contentType[i].fields).join(',')

    // Order fields according to your weight
    // var sortedFields = [];
    // Object.keys(contentType[i].fields).forEach((e) => {
    //   sortedFields.push({
    //     name: e,
    //     weight: contentType[i].fields[e].display_weight
    //   });
    // });
    // sortedFields.sort((a, b) => (a.weight ?? Infinity) - (b.weight ?? Infinity));
    // var sortedFieldNames = sortedFields.map(field => field.name).join(',');

    const params: any = {
      "filter[status]": 1,
      [`fields[node--${i}]`]: `${fields}`,
      sort: "-created",
    };

    // Verify if exist el campo imagen para traer la información
    Object.keys(contentType[i].fields).map((e) => {
      if (contentType[i].fields[e].type == 'image') {
        nameFieldImage.push(e)
        params.include = 'uid,' + e;
      }
    })

    const contentTypeNews = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
      `node--${i}`,
      context,
      {
        params
      }
    )
    return contentTypeNews
  }))


  return {
    props: {
      contentTypeNewsPromises: contentTypeNewsPromises.flat(),// Flatten the array of arrays
      nameFieldImage,
    },
  }
}

