<template>
  <div flex items-center w-full gap8 p4>
    <NavItem to="/" title="Work Orders" icon="i-carbon:task" />
    <NavItem to="/jobs" title="Jobs" icon="i-fluent:paint-brush-24-regular" />
    <NavItem to="/directory" title="Directory" icon="i-akar-icons-people-group" />
    <div ml-auto flex items-center gap4>
      <RefreshData place-self-end/>
      <DarkSwitcher justify-self-end/>
    </div>
  </div>
</template>
