import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('../components/custom/VStats'), {
  ssr: false
})
//@ts-ignore
export default () => <DynamicComponentWithNoSSR />
