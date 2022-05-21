import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('../components/custom/VSupplier'), {
  ssr: false
})
//@ts-ignore
export default () => <DynamicComponentWithNoSSR />
