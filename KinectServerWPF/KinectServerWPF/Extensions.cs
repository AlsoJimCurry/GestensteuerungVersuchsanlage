using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media.Media3D;

namespace KinectServerWPF
{
    class Extensions
    {
        public bool armStretched(Vector3D wrist, Vector3D elbow, Vector3D shoulder)
        {
            double armAngle = angleBetween(wrist - elbow, shoulder - elbow);
            if (armAngle > 150 || armAngle < 210) return true;
            else return false;
        }

        public double angleBetween(Vector3D a, Vector3D b)
        {
            a.Normalize();
            b.Normalize();
            double dotProduct = Vector3D.DotProduct(a, b);

            return (double)Math.Acos(dotProduct) / Math.PI * 180;
        }
    }
}
