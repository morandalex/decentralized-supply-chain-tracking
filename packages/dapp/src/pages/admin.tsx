import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('../components/custom/VAdmin'), {
  ssr: false
})
//@ts-ignore
export default () => <DynamicComponentWithNoSSR />

