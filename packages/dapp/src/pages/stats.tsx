import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('../components/custom/VStats'), {
  ssr: false
})

export default () => <DynamicComponentWithNoSSR />
