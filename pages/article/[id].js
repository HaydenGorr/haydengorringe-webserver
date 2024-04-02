import Layout from '../../components/layout';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Chip from '../../components/chip';
import MB_Button from '../../components/buttons/MB_Button';
import Image from 'next/image';

export default function Article({mdxSource}) {
    const components = {
        Chip,
        MB_Button,
        Image,
    };

    return (
        <Layout>
            <div className='flex justify-center pt-3 py-6 px-3'>
                <div className="prose max-w-prose">
                    {/* <MDXContent home_post_obj_source={id}/> */}
                    <MDXRemote {...mdxSource} components={components}/>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_ROUTE}/CMS/articles/${id}/article.mdx`);
    const mdxContent = await res.text();
    
    // Serialize the MDX content only
    const mdxSource = await serialize(mdxContent);

    return { props: { mdxSource } }; 
}