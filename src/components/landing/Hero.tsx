
export default function Hero() {
  return (
    <section
      className="relative isolate"
      aria-label="Hero"
      style={{
        backgroundImage:
          "url('https://scontent.fmnl45-1.fna.fbcdn.net/v/t39.30808-6/467636109_122121564572534984_639443777943740619_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGJ8_wfPGiApxUHPAuScSCDdpUJqGPzE9Z2lQmoY_MT1tPltEcJRe-te0-mX-DfFrpaqFZ618Qt_R9xiLNoVtCe&_nc_ohc=N_h5uukwwY0Q7kNvwElOZJg&_nc_oc=AdmmKZm_-EtuhMzpGpH6Utys3keem9ygLLRiYU2tOpnoSfsNx5AR7TOZN1npKMDr5_awWU_F0LkPgtMl0LeHVmLo&_nc_zt=23&_nc_ht=scontent.fmnl45-1.fna&_nc_gid=wEnZz-Tw5ENUtesd-IlgDw&oh=00_Afja3vEUBPzqcDJmIqZOSGSWmlzn4loLB_auAA7CKTcHmg&oe=69164D4E')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto flex w-full max-w-6xl items-start justify-between gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <a href="/menu" className="sr-only">
          Skip to menu
        </a>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-7xl">
            Sisigan Ni Kuya Moy
          </h1>
          <div className="mt-4 flex text-2xl justify-center font-bold text-orange-400 mb-32">
            Para sa estudyanteng gutom pero tipid
          </div>
        </div>
      </div>
    </section>
  );
}
