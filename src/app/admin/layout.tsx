type AdminLayoutProps = Readonly<{
  children: React.ReactNode
}>

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return <div className="font-sans">{children}</div>
}

export default AdminLayout
