import * as cad from '@jscad/modeling'

export function generateModel()
{
    const dodecahedron = (h: number) => {
        let cuboid1 = cad.primitives.cuboid({ size: [20, 20, 10] })
        for (let i = 0; i <= 4; i++) {
          // loop i from 0 to 4, and intersect results
          // make a cube, rotate it 116.565 degrees around the X axis,
          // then 72*i around the Z axis
         cuboid1 = cad.booleans.intersect(
            cuboid1,
            cad.transforms.rotateZ(i * cad.utils.degToRad(72),
              cad.transforms.rotateX(cad.utils.degToRad(116.565),
                cad.primitives.cuboid({ size: [20, 20, 10] }))
            )
          )
        }
        return cad.transforms.scale([h, h, h], cuboid1) // scale by height parameter
      }

    return dodecahedron(10);  
}


