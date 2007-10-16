
EasyCookie=(function(){var EPOCH='Thu, 01-Jan-1970 00:00:01 GMT',MS_PER_DAY=1000*60*60*24,ENCODE_KEYS=['expires','path','domain'],me,esc=escape,un=unescape;var get_now=function(){var ret=new Date();ret.setTime(ret.getTime());return ret;}
var cookify=function(c_key,c_val){var i,key,val,ret=[],opt=(arguments.length>2)?arguments[2]:{};ret.push(esc(c_key)+'='+esc(c_val));for(i=0;i<ENCODE_KEYS.length;i++){key=ENCODE_KEYS[i];if(val=opt[key])
ret.push(key+'='+val);}
if(opt.secure)
ret.push('secure');return ret.join('; ');}
var alive=function(){var key='__EC_TEST__',val=new Date();val=val.toGMTString();this.set(key,val);this.enabled=(this.remove(key)==val);return this.enabled;}
me={set:function(key,val){var opt=(arguments.length>2)?arguments[2]:{},now=get_now(),expire_at,cfg={};if(opt.expires){opt.expires*=MS_PER_DAY;cfg.expires=new Date(now.getTime()+opt.expires);cfg.expires=cfg.expires.toGMTString();}
var keys=['path','domain','secure'];for(i=0;i<keys.length;i++)
if(opt[keys[i]])
cfg[keys[i]]=opt[keys[i]];ret=cookify(key,val,cfg);document.cookie=ret;return val;},has:function(key){key=esc(key);var c=document.cookie,ofs=c.indexOf(key+'='),len=ofs+key.length+1,sub=c.substring(0,key.length);return((!ofs&&key!=sub)||ofs<0)?false:true;},get:function(key){key=esc(key);var c=document.cookie,ofs=c.indexOf(key+'='),len=ofs+key.length+1,sub=c.substring(0,key.length),end;if((!ofs&&key!=sub)||ofs<0)
return null;end=c.indexOf(';',len);if(end<0)
end=c.length;return un(c.substring(len,end));},remove:function(key){var ret=me.get(key),opt={expires:EPOCH};document.cookie=cookify(key,'',opt);return ret;},keys:function(){var c=document.cookie,pairs=c.split('; '),i,pair,ret=[];for(i=0;i<pairs.length;i++){pair=pairs[i].split('=');ret.push(un(pair[0]));}
return ret;},all:function(){var c=document.cookie,pairs=c.split('; '),i,pair,ret=[];for(i=0;i<pairs.length;i++){pair=pairs[i].split('=');ret.push([un(pair[0]),un(pair[1])]);}
return ret;},version:'0.2.0',enabled:false};me.enabled=alive.call(me);return me;}());