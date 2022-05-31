<template>
  <main font-sans text="fg-norm" bg="bg-f"  flex flex-col min-h-screen>
    <Nav fixed bottom-0 w-full md="static"/>
    <router-view w-full max-w-7xl m-auto md="p-8"/>
    <Footer />
  </main>
</template>
