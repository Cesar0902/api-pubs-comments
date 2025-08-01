import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';

export class AuthController {
  constructor ({ authModel }) {
    this.authModel = authModel;
  }

  login = async (req, res) => {
    const { user, password } = req.body;

    const data = await this.authModel.loginUser(user);

    // validar que la contraseña sea correcta
    if (!(await bcrypt.compare(password, data.password_hash))) {
      res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });

      return;
    }

    // validar si no debe cambiar la contraseña
    if (data.must_change_password) {
      // obligarlo a cambiar de contraseña
      const tokenTemporal = jwt.sign(
        {
          id: data.id,
          password: data.password_hash
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h'
        }
      );

      res.json({
        success: true,
        message: 'Debe cambiar su contraseña',
        data: {
          token: tokenTemporal
        }
      });

      return;
    }

    // puedo retornar la información del usuario

    const payload = {
      id: data.id,
      role: data.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256', // Sha2
      expiresIn: '12h'
    });

    delete data.password_hash; // eliminar la contraseña del objeto de datos

    res.json({
      success: true,
      message: 'Usuario autenticado correctamente',
      data,
      token
    });
  };

  createUser = async (req, res) => {
    const { name, email, phone, role, password } = req.body;

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const result = await this.authModel.register([
        id,
        name,
        email,
        phone,
        passwordHash,
        role
      ]);

      // TODO: envair correro
      console.log(process.env.RESEND_API_KEY);
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'noreply@esshn.com',
        to: email,
        subject: 'Creación de cuenta',
        html: '<p>Tu cuenta ha sido creada correctamente.</p>'
      });

      res.json({
        success: true,
        message: 'Usuario creado correctamente',
        data: {
          id,
          name,
          email,
          phone,
          role,
          must_change_password: true // obligar a cambiar la contraseña
        }
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: 'Error al crear el usuario',
        error: error.message
      });
    }
  };

  setPassword = async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
      const { id, password } = jwt.verify(token, process.env.JWT_SECRET);

      if (!(await bcrypt.compare(oldPassword, password))) {
        res.status(401).json({
          success: false,
          message: 'La contraseña anterior no es correcta'
        });

        return;
      }

      // validar que las contraseñas nuevas coincidan
      if (newPassword !== confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'Las contraseñas nuevas no coinciden'
        });

        return;
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await this.authModel.updatePassword(id, passwordHash);

      res.json({
        success: true,
        message: 'Contraseña actualizada correctamente'
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Debe iniciar sesión para cambiar la contraseña'
      });
    }
  };
}
