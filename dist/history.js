// Small settings snapshots only: no audio buffers are retained by history.
(()=>{
 const copy=value=>JSON.parse(JSON.stringify(value));
 const signature=state=>JSON.stringify({mode:state.mode,chain:state.chain,values:state.values});
 window.SonicHistory=function(initial,limit=80){
  let entries=[copy(initial)],cursor=0,activeKey='';
  return {
   reset(state){entries=[copy(state)];cursor=0;activeKey='';},
   record(state,key='',phase=''){
    if(signature(state)===signature(entries[cursor])){if(phase==='change')activeKey='';return false;}
    entries=entries.slice(0,cursor+1);
    if(key&&key===activeKey&&phase==='input')entries[cursor]=copy(state);
    else{entries.push(copy(state));cursor++;if(entries.length>limit){entries.shift();cursor--;}}
    activeKey=phase==='input'?key:'';return true;
   },
   undo(){if(!cursor)return null;activeKey='';return copy(entries[--cursor]);},
   redo(){if(cursor>=entries.length-1)return null;activeKey='';return copy(entries[++cursor]);},
   get canUndo(){return cursor>0;},get canRedo(){return cursor<entries.length-1;}
  };
 };
})();
