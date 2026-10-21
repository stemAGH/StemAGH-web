"""Render original StemAGH interface motion; requires Pillow, NumPy and ffmpeg.
No stock footage, generated testimonials or customer data. Run from repository root.
"""
import math
import subprocess
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS, SECONDS = 1280, 720, 30, 9
OUT = Path('public/media')
OUT.mkdir(parents=True, exist_ok=True)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(n, bold=False): return ImageFont.truetype(BOLD if bold else FONT, n)
def smooth(t):
    t = max(0, min(1, t)); return t*t*(3-2*t)
def text(d, xy, s, n=16, fill='#adc2e8', bold=False): d.text(xy,s,font=font(n,bold),fill=fill)
def panel(kind):
    im=Image.new('RGBA',(800,450),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle((1,1,798,448),radius=18,fill='#101e36',outline='#496ba5',width=2)
    d.line((0,44,800,44), fill='#314665')
    for x in [22,36,50]: d.ellipse((x,19,x+5,24),fill='#6687bb')
    text(d,(320,15),'STEMAGH / CONCEPT',11)
    if kind == 0:
        text(d,(38,68),'YOUR BUSINESS',13,'#e5edff',True)
        text(d,(560,70),'ABOUT   /   SERVICES   /   CONTACT',9)
        text(d,(40,143),'A clearer way',40,'#edf3ff',True)
        text(d,(40,196),'to move forward.',40,'#87b4ff',True)
        text(d,(43,274),'YOUR EXPERTISE. A WEBSITE THAT SHOWS IT.',11)
        d.rounded_rectangle((42,320,256,362),radius=6,fill='#0b65dd')
        text(d,(62,332),'START A CONVERSATION',11,'#ffffff',True)
        for i in range(5):
            x=510+i*25; y=155+i*15
            d.rounded_rectangle((x,y,x+105,y+160),radius=14,fill=(31+i*10,66+i*12,125+i*15,255),outline='#699deb')
    elif kind == 1:
        d.rectangle((2,46,155,431),fill='#132640')
        text(d,(20,78),'WORKSPACE',13,'#e2edff',True)
        for i,s in enumerate(['Overview','Workflows','Reviews','Handover']): text(d,(23,137+i*48),s,12)
        text(d,(185,83),'From brief to build.',30,'#edf3ff',True)
        for i,s in enumerate(['DISCOVER','BUILD','REVIEW']):
            x=186+i*191;d.rounded_rectangle((x,151,x+170,398),radius=8,fill='#172d4d',outline='#355682')
            text(d,(x+14,169),s,10,'#a5c4ff',True)
            for j,label in enumerate([['Requirements','Workflow map'],['Interface','Implementation'],['Feedback','Launch checks']][i]):
                y=210+j*78;d.rounded_rectangle((x+12,y,x+156,y+61),radius=5,fill='#213c61')
                text(d,(x+22,y+15),label,11,'#e3eeff')
                d.line((x+22,y+42,x+85,y+42),fill='#7199d4',width=3)
    else:
        text(d,(43,77),'DELIVERED WITH CLARITY',12,'#a8c9ff',True)
        text(d,(44,133),'Your product.',43,'#edf3ff',True)
        text(d,(44,190),'Your control.',43,'#87b4ff',True)
        for i,s in enumerate(['Domain & hosting accounts','Deployment & launch checks','Access & handover notes']):
            y=274+i*43;d.ellipse((46,y,64,y+18),fill='#2e609c')
            text(d,(77,y-1),s,15,'#d7e6ff')
        d.rounded_rectangle((535,139,726,330),radius=35,fill='#173963',outline='#73a8f4',width=2)
        d.line((584,237,620,274,683,195),fill='#b7d3ff',width=10)
    return im
panels=[panel(i) for i in range(3)]
yy,xx=np.mgrid[0:H,0:W]
r=np.exp(-(((xx-W*.53)/(W*.48))**2+((yy-H*.45)/(H*.65))**2)*3)
bg=np.stack([5+r*8,12+r*19,27+r*44],axis=2).astype('uint8')
base=Image.fromarray(bg).convert('RGBA')

def project(im, cx, cy, scale, yaw, pitch):
    corners=[]
    for x,y in [(-400,-225),(400,-225),(400,225),(-400,225)]:
        z=-x*math.sin(yaw); x=x*math.cos(yaw)
        y,z=y*math.cos(pitch)-z*math.sin(pitch),y*math.sin(pitch)+z*math.cos(pitch)
        f=1200/(1200+z)
        corners.append((cx+x*scale*f,cy+y*scale*f))
    a=[];b=[]
    for (x,y),(u,v) in zip(corners,[(0,0),(800,0),(800,450),(0,450)]):
        a.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]);b.extend([u,v])
    coef=np.linalg.solve(np.array(a),np.array(b))
    return im.transform((W,H),Image.Transform.PERSPECTIVE,coef,Image.Resampling.BICUBIC)

proc=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','-','-an','-c:v','libx264','-preset','slow','-crf','22','-pix_fmt','yuv420p','-g','15','-keyint_min','15','-sc_threshold','0','-movflags','+faststart',str(OUT/'stemagh-story.mp4')],stdin=subprocess.PIPE)
for frame in range(FPS*SECONDS):
    t=frame/(FPS*SECONDS-1); phase=t*3
    image=base.copy(); d=ImageDraw.Draw(image)
    # Quiet architectural guides anchor the composition; interface layers carry the story.
    for j in range(5):
        x=180+j*230;d.line((x,70,x,H-110),fill='#132440')
    d.line((100,550,1180,550),fill='#233a5a')
    for j in range(25):
        angle=j*2.399+ t*.8
        x=640+math.cos(angle)*(460+35*math.sin(j));y=320+math.sin(angle)*210
        d.ellipse((x,y,x+2,y+2),fill='#426591')
    for k in range(3):
        # At each chapter, the matching surface moves forward, then hands over to the next.
        a=smooth(phase-k+.35); b=smooth(phase-k-.65)
        visibility=a*(1-b) if k<2 else a
        if visibility<=0: continue
        sc=.72+.17*visibility
        cx=640+(1-visibility)*(140 if k%2 else -140)
        cy=300+(1-visibility)*20
        yaw=(1-visibility)*.52+math.sin(t*math.pi*2)*.07
        layer=project(panels[k],cx,cy,sc,yaw,-.055)
        layer.putalpha(layer.getchannel('A').point(lambda x:int(x*visibility)))
        image=Image.alpha_composite(image,layer)
    d=ImageDraw.Draw(image)
    text(d,(73,39),'STEMAGH',15,'#d4e4ff',True)
    text(d,(922,42),'DESIGN / DEVELOP / DELIVER',10,'#9bb7e4')
    text(d,(76,591),'FROM COMPLEXITY TO CLARITY',11,'#c5d9fb')
    text(d,(76,620),'Original interface motion · illustrative content',10,'#93aacc')
    d.line((75,670,1205,670),fill='#2b4267',width=2)
    d.line((75,670,75+1130*t,670),fill='#7caeff',width=2)
    if frame==55: image.convert('RGB').save(OUT/'stemagh-story-poster.jpg',quality=90)
    proc.stdin.write(image.convert('RGB').tobytes())
proc.stdin.close()
if proc.wait(): raise SystemExit('Video encoding failed')
print('Rendered original 9-second film and poster to public/media')
